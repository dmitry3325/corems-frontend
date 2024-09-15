import * as yup from 'yup';
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";

import { SignUpUserRequest } from "@/user/model/Auth";
import { signUpUser } from "@/user/store/AuthSlice";
import { ApiErrorResponse } from "@/common/model/Response";
import { useAppDispatch } from '@/app/Hooks';

const signUpUserSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup.string().required('Password is required'),
});


interface SignUpFormProps {
  onSignedUp: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignedUp }) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signUpUserSchema),
  });


  const onSubmit = async (data: SignUpUserRequest) => {
    try {
      await dispatch(signUpUser(data));
      onSignedUp();
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
      </FloatingLabel>
      <Row>
        <Col md={6}>
          <FloatingLabel
            controlId="firstName"
            label="First Name"
            className="mb-3"
          >
            <Form.Control
              type="input"
              placeholder="First Name"
              size="lg"
              className="border-0 border-bottom rounded-0"
              isInvalid={!!errors.firstName}
              {...register('firstName')}
            />
          </FloatingLabel>
        </Col>
        <Col md={6}>
          <FloatingLabel
            controlId="lastName"
            label="Last Name"
            className="mb-3"
          >
            <Form.Control
              type="input"
              placeholder="Last Name"
              size="lg"
              className="border-0 border-bottom rounded-0"
              isInvalid={!!errors.lastName}
              {...register('lastName')}
            />
          </FloatingLabel>
        </Col>
      </Row>

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
          isInvalid={!!errors.password}
          {...register('password')}
        />
      </FloatingLabel>
      <FloatingLabel
        controlId="floatingConfirmPassword"
        label="Confirm Password"
        className="mb-3"
      >
        <Form.Control
          type="password"
          placeholder="Password"
          size="lg"
          className="border-0 border-bottom rounded-0"
          isInvalid={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
      </FloatingLabel>
      <div className="d-grid mb-3">
        <Button variant="dark" size="lg" type="submit" disabled={isSubmitting} className="rounded-0 fs-6 py-2">
          Register new account
        </Button>
      </div>
    </Form>
  );
};

export default SignUpForm;