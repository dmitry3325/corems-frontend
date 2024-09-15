import * as yup from 'yup';
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { signInUser } from "@/user/store/AuthSlice";
import { SignInUserRequest } from "@/user/model/Auth";
import { useAppDispatch } from "@/app/Hooks";
import { ApiErrorResponse } from "@/common/model/Response";
import { ROUTE_HOME } from "@/app/Router";


const signInSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});


const SignInForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });


  const onSubmit = async (data: SignInUserRequest) => {
    try {
      await dispatch(signInUser(data));
      navigate(ROUTE_HOME);
    } catch (requestError) {
      const errorResponse = requestError as { data?: ApiErrorResponse };
      if (errorResponse.data) {
        const serverErrors = errorResponse.data as ApiErrorResponse;
        Object.values(serverErrors.errors).forEach((error) => {
          setError("root", {
            type: 'server',
            message: error.details,
          });
        });
      }
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} className="needs-validation">
      <FloatingLabel
        controlId="floatingEmail"
        label="Email"
        className="mb-3"
      >
        <Form.Control
          type="email"
          placeholder="Enter email"
          size="lg"
          className="border-0 border-bottom rounded-0"
          isInvalid={!!errors.email}
          {...register('email')}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </FloatingLabel>
      <FloatingLabel
        controlId="floatingPassword"
        label="Password"
        className="mb-3"
      >
        <Form.Control
          type="password"
          placeholder="Password"
          size="lg"
          className="border-0 border-bottom rounded-0"
          required
          isInvalid={!!errors.password}
          {...register('password')}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </FloatingLabel>
      <span className="error text-danger px-2">{errors.root?.message}</span>
      <Row className="justify-content-cenmt mb-3">
        <Col xs={{ span: 6, offset: 6 }} className="text-end">
          <Link to={'forgot_password'} className="link-secondary text-decoration-none">Forgot password?</Link>
        </Col>
      </Row>
      <div className="d-grid mb-3">
        <Button variant="dark" size="lg" type="submit" disabled={isSubmitting} className="rounded-0 fs-6 py-2">Sign In</Button>
      </div>
    </Form>
  );
};

export default SignInForm;