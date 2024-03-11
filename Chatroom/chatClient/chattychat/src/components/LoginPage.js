import React, { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 

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
			else{
			const response = await axios.post('http://localhost:8081/auth/signin', { regEmail, regPassword }); 
			console.log('Login successful:', response.data); 
            const param=regEmail.substring(0,regEmail.indexOf("@"));
			history('/chats',{state:{
				userName : param,
				receiverName:"",
				connected:false,
				message:""		}}); 
			}
		} catch (error) { 
			console.error('Login failed:', error.response ? error.response.data : error.message); 
			setError('Invalid regEmail or regPassword.'); 
		} 
	}; 

	return ( 
		<div className="login"> 
			<div className="loginComponents" style={{ width: '500px', height: 'auto' }}>
			<h2 className="loginTitle">Login Page</h2>  
				<form> 
					<input className="comp" placeholder='Email address' id='email' value={regEmail} type='email' onChange={(e) => setRegEmail(e.target.value)} /> 
					<input  className="comp"placeholder='Password' id='regPassword' type='regPassword' value={regPassword} onChange={(e) => setPassword(e.target.value)} /> 
					{error && <p className="text-danger">{error}</p>} {/* Render error message if exists */} 
					<button className="comp"  onClick={handleLogin}>Sign in</button>
                    <button className="comp"  onClick={()=>history('/chatroom')}>JOIN Live Chatroom</button> 
					<div className="comp"> 
						<p>Not a member? <a href="/signup" >Register</a></p> 
					</div> 
				</form> 
			</div> 
		</div> 
	); 
} 

export default LoginPage; 
