import React, { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import { 
	MDBContainer, 
	MDBInput, 
	MDBBtn, 
} from 'mdb-react-ui-kit'; 

function LoginPage() { 
	const [regEmail, setRegEmail] = useState(''); 
	const [regPassword, setPassword] = useState(''); 
	const [error, setError] = useState(''); 
	const history = useNavigate(); 

	const handleLogin = async () => { 
		try { 
			if (!regEmail || !regPassword) { 
				setError('Please enter both regEmail and regPassword.'); 
				return; 
			} 

			const response = await axios.post('http://localhost:8081/auth/signin', { regEmail, regPassword }); 
			console.log('Login successful:', response.data); 
            const param=regEmail.substring(0,regEmail.indexOf("@"));
			history('/chats',{state:{userName :param,
                           receiverName:"",
                            connected:false,
                            message:""}}); 
		} catch (error) { 
			console.error('Login failed:', error.response ? error.response.data : error.message); 
			setError('Invalid regEmail or regPassword.'); 
		} 
	}; 

	return ( 
		<div className="d-flex justify-content-center align-items-center vh-100"> 
			<div className="border rounded-lg p-4" style={{ width: '500px', height: 'auto' }}> 
				<MDBContainer className="p-3"> 
					<h2 className="mb-4 text-center">Login Page</h2> 
					<MDBInput wrapperClass='mb-4' placeholder='Email address' id='email' value={regEmail} type='email' onChange={(e) => setRegEmail(e.target.value)} /> 
					<MDBInput wrapperClass='mb-4' placeholder='Password' id='regPassword' type='regPassword' value={regPassword} onChange={(e) => setPassword(e.target.value)} /> 
					{error && <p className="text-danger">{error}</p>} {/* Render error message if exists */} 
					<button className="mb-4 d-block btn-primary" style={{ height:'50px',width: '100%' }} onClick={handleLogin}>Sign in</button>
                    <button className="mb-4 d-block btn-primary" style={{ height:'50px',width: '100%' }} onClick={()=>history('/chatroom')}>JOIN Live Chatroom</button> 
					<div className="text-center"> 
						<p>Not a member? <a href="/signup" >Register</a></p> 
					</div> 
				</MDBContainer> 
			</div> 
		</div> 
	); 
} 

export default LoginPage; 
