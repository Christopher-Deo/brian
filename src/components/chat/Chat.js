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
    const [latestReply, setLatestReply] = useState('');

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setHidden(false);
        await getAnswer(input);
        setLatestReply(reply);
        console.log('input value is :', input);
    };

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    const handleClick = () => {
        setInput('');
    };

    const handleNewResponse = async () => {
        await getAnswer(reply);
        setLatestReply(reply);
        setReply('');
    };


    const handleClearReplies = () => {
        setReplies([]);
    };

    const getAnswer = async (input) => {
        setIsLoading(true);
        const prompt = `The following is a conversation with an AI assistant. The assistant is not very helpful, but is creative, clever, very sarcastic and answers every question with an adult sense of humor.
    Human: ${input}
    AI: `;
        try {
            console.log('making request to openai');
            const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
                method: 'POST',
                body: JSON.stringify({
                    prompt,
                    max_tokens: 2046,
                    temperature: 0.8,
                    n: 1,
                    stop: '\n',
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer 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`, // replace with your actual OpenAI API key
                },
            });
            console.log('response is: ', response);

            const { choices } = await response.json();
            setReply(choices[0].text.trim());
            setIsLoading(false);
            console.log('reply is: ', reply);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };


    return (
        <Container className="mt-5 border border2 border-danger rounded mb-2">
            <h1 className="text-center">Welcome to Brian!</h1>
            <h2 className="text-center">Home of the irreverent and sarcastic chat bot!</h2>
            <Form className="border border2 border-primary rounded p-4 mb-2" onSubmit={handleSubmit}>
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

            <div className="border border2 border-primary rounded p-4 mb-2">
                <h4 className='mt-2'>Replies:</h4>
                <div className="mt-3 mb-5">
                    {latestReply && <p key={uuid()}>{latestReply}</p>}
                </div>

                <div className='d-flex justify-content-between'>
                    <Button variant="danger" type="button" onClick={handleClearReplies}>
                        Clear replies
                    </Button>
                    <Button variant='warning' type="button" onClick={handleNewResponse}>
                        Generate New Response
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default Chat;