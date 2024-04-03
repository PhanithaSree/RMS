import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from '../components/Login';
import axios from 'axios';

jest.mock('axios');

describe('Login component', () => {
  it('renders login form', () => {
    const { getByLabelText, getByText } = render(<Login />);
    
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByText('New User?')).toBeInTheDocument();
  });

  it('displays error message for invalid credentials', async () => {
    axios.post.mockRejectedValueOnce(new Error('Invalid credentials'));
    const { getByLabelText, getByText } = render(<Login />);
    
    fireEvent.change(getByLabelText('Email'), { target: { value: 'sree' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'sree1' } });
    fireEvent.submit(getByText('Login'));

    await waitFor(() => {
      expect(getByText('Failed to Login, Check Credentials')).toBeInTheDocument();
    });
  });

  it('redirects user after successful login', async () => {
    const userData = { email: 'sree@gmail.com', role: 'visitor', _id: '123' };
    axios.post.mockResolvedValueOnce({ status: 200, data: { status: true, user: userData } });
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);

    const { getByLabelText, getByText } = render(<Login />);
    
    fireEvent.change(getByLabelText('Email'), { target: { value: 'sree@gmail.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'Sree@123456' } });
    fireEvent.submit(getByText('Login'));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });
});
