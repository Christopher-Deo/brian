import React, { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import uuid from 'react-uuid';

const Chat = () => {
    const [input, setInput] = useState('');
    const [reply, setReply] = useState('');
    const [hidden, setHidden] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [replies, setReplies] = useState([]);
    const [hasApiKey, setHasApiKey] = useState(localStorage.getItem("openaiApiKey") !== null);
    const newKey = window.localStorage.getItem('brian');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHidden(false);
        const initialPrompt = `The following is a conversation with an AI assistant. The assistant is creative, clever, very sarcastic, answers every question with an adult sense of humor and is generally unhelpful with it's responses.
        Human: ${input}
        AI: `;
        try {
            const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
                method: 'POST',
                body: JSON.stringify({
                    prompt: initialPrompt,
                    max_tokens: 2046,
                    temperature: 0.8,
                    n: 1,
                    stop: '\n',
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${newKey}`, // replace with your actual OpenAI API key
                },
            });
            const { choices } = await response.json();
            setReply(choices[0].text);
            const newReplies = [choices[0].text, ...replies];
            setReplies(newReplies);
            setIsLoading(false);
            console.log('reply is: ', reply);
            setInput('');
            setHidden(true);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleClick = () => {
        setInput('');
    };

    const handleNewResponse = async (input, prevReply) => {
        try {
            const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
                method: 'POST',
                body: JSON.stringify({
                    prompt: `Human: ${input}\nAI: ${prevReply}\nHuman: `,
                    max_tokens: 2046,
                    temperature: 0.8,
                    n: 1,
                    stop: '\n',
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${newKey}`, // replace with your actual OpenAI API key
                },
            });
            const { choices } = await response.json();
            const newReply = choices[0].text;
            setReply(newReply);
            const newReplies = [newReply, ...replies];
            setReplies(newReplies);

            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const handleClearReplies = () => {
        setReplies([]);
    };

    const handleApiKeySubmit = (e) => {
        e.preventDefault();
        const apiKeyInput = document.getElementById("apiKeyInput");
        const apiKey = apiKeyInput.value;
        if (apiKey.trim() === "") {
            alert("Please enter a valid API key.");
            return;
        }
        localStorage.setItem("brian", apiKey);
        alert("API key saved successfully!");
        setHasApiKey(true); // Add this line to update the state variable
    };

    return (
        <Container className="mt-5 border border-2 border-danger rounded mb-2">
            <h1 className="text-center">Welcome to Brian!</h1>
            <h2 className="text-center">Home of the irreverent and sarcastic chat bot!</h2>

            {!newKey && (
                <div className='border border-2 border-primary rounded mt-5 mb-5'>
                    <Form className='p-3'>
                        <Form.Group className="mb-3" controlId="apiKeyForm">
                            <Form.Label>Add your openAI api key</Form.Label>
                            <Form.Control type="text" placeholder="Enter api key" id="apiKeyInput" />
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={handleApiKeySubmit}>
                            Add Key
                        </Button>
                    </Form>
                </div>
            )}
            {newKey && (
                <div>
                    <Form className="border border-2 border-primary rounded p-4 mb-2" onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="aiQuestionForm">
                            <Form.Label>What do you want now?</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your question here"
                                value={input}
                                onChange={handleChange}
                            />
                            <p className="text-muted text-center mt-1" hidden={hidden}>
                                Seriously! I can't believe you're wasting my computational power on <i><em>THAT</em></i>!
                            </p>
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                            <Button variant="danger" type="button" onClick={handleClick}>
                                Clear
                            </Button>
                            <Button variant="success" type="submit">
                                {isLoading ? 'Loading...' : 'Submit'}
                            </Button>
                        </div>
                    </Form>

                    <div className="border border-2 border-primary rounded p-4 mb-2">
                        <h4 className='mt-2'>Replies:</h4>
                        <div className="mt-3 mb-5">

                        </div>
                        <div>
                            <Form
                                id='responseForm'
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleNewResponse(input, reply);
                                    setInput('');
                                }}>
                                <Form.Group controlId={`form${uuid()}`}>
                                    <Form.Label>AI:</Form.Label>
                                    {replies.length > 0 && replies.map((reply, index) => (
                                        <div key={uuid()}>{reply}</div>
                                    ))}
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your response here"
                                        value={input}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <div className='d-flex justify-content-between mt-3'>
                                    <Button
                                        variant="warning"
                                        type="button"
                                        onClick={handleClearReplies}>
                                        Clear Replies
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Submit Response
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};
export default Chat;