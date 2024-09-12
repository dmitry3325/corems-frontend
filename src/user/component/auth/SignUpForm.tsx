import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";

const SignUpForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email');
    const password = formData.get('password');

    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FloatingLabel
        controlId="floatingEmail"
        label="Email"
        className="mb-3"
      >
        <Form.Control
          type="email"
          name="email"
          placeholder="Enter email"
          size="lg"
          className="border-0 border-bottom rounded-0"
        />
      </FloatingLabel>
      <FloatingLabel
        controlId="floatingPassword"
        label="Password"
        className="mb-3"
      >
        <Form.Control
          type="password"
          name="password"
          placeholder="Password"
          size="lg"
          className="border-0 border-bottom rounded-0"
          required
        />
      </FloatingLabel>
      <FloatingLabel
        controlId="floatingConfirmPassword"
        label="Confirm Password"
        className="mb-3"
      >
        <Form.Control
          type="password"
          name="confirm-password"
          placeholder="Password"
          size="lg"
          className="border-0 border-bottom rounded-0"
          required
        />
      </FloatingLabel>
      <div className="d-grid mb-3">
        <Button variant="dark" size="lg" type="submit" className="rounded-0 fs-6 py-2">
          Register new account
        </Button>
      </div>
    </Form>
  );
};

export default SignUpForm;