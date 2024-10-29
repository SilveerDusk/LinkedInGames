'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const SignIn: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect_url = process.env.NEXT_PUBLIC_REDIRECT_URI as string;
  const client_id = process.env.NEXT_PUBLIC_ID as string;
  const state = process.env.NEXT_PUBLIC_STATE as string;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const signIn = async () => {
    const response = await fetch(`/api/user/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, name: name }),
    });
    if (response.status === 201) {
      console.log('User created');
    } else {
      console.log('Failed to create user: ', response.status);
    }
    return response;
  }

  const verifyAccount = async () => {
    const response = await fetch(`/api/user/${email}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    });
    if (response.status === 201) {
      console.log('Account verified');
    } else {
      console.log('Failed to verify account');
    }
    return response;
  }

  const handleSignIn = async () => {
    const response = await signIn();
    if (response.status === 200) {
      router.push(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&state=${state}&scope=openid%20profile%20email&client_id=${client_id}&redirect_uri=${redirect_url}`);
      if (searchParams.has('code') && searchParams.has('state') && searchParams.get('state') === state) {
        console.log('verified');
        await verifyAccount();
      }
    }
  };

  return (
    <div>
      <h1>Sign In</h1> 
      <input type="text" placeholder='Name' onChange={(e) => setName(e.target.value)}></input> 
      <input type="text" placeholder='Email' onChange={(e) => setEmail(e.target.value)}></input>
      <button type="button" onClick={handleSignIn} style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', borderRadius: '5px' }}>
        Verify With LinkedIn
      </button>
    </div>
  );
};

export default SignIn;