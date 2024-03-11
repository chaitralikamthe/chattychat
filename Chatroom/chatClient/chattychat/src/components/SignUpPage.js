import React, { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; // Import useHistory hook 


const SignupPage=()=> { 
    const [regUserName, setRegUserName] = useState(''); 
	const [regEmail, setRegEmail] = useState(''); 
	const [regPassword, setRegPassword] = useState(''); 
	const [confirmPassword, setConfirmPassword] = useState(''); 
	const [regMobile, setRegMobileNumber] = useState(''); 
	const [error, setError] = useState(''); // State to manage error messages 
	const history = useNavigate(); // Get the history object for redirection 

	const handleSignup = async () => { 
		try { 
			// Check for empty fields 
			if (!regUserName || !regEmail || !regPassword || !confirmPassword || !regMobile) { 
				setError('Please fill in all fields.'); 
				return; 
			} 

			if (regPassword !== confirmPassword) { 
				throw new Error("Passwords do not match"); 
			} 

			const response = await axios.post('http://localhost:8081/auth/signup', { 
				regUserName, 
				regEmail, 
				regPassword, 
				regMobile 
			}); 
			// Handle successful signup 
			console.log("Hellooooooooo"+ response.data); 
			history('/',{state:{regUserName}}); 
		} catch (error) { 
			// Handle signup error 
			console.error('Signup failed:', error.response ? error.response.data : error.message); 
			setError(error.response ? error.response.data : error.message); 
		} 
	}; 

	return ( 
		<div className="login"> 
			<div className="loginComponents"  style={{width: '600px', height: 'auto'}}> 
				<form> 
					<h2 className="mb-4 text-center">Sign Up Page</h2> 

					<input className="comp" id='regUserName' placeholder="Your Name" value={regUserName} type='text'
							onChange={(e) => setRegUserName(e.target.value)}/> 
					<input className="comp" placeholder='Email Address' id='regEmail' value={regEmail} type='regEmail'
							onChange={(e) => setRegEmail(e.target.value)}/> 
					<input className="comp" placeholder='Password' id='regPassword' type='regPassword' value={regPassword} 
							onChange={(e) => setRegPassword(e.target.value)}/> 
					<input className="comp" placeholder='Confirm Password' id='confirmPassword' type='regPassword'
							value={confirmPassword} 
							onChange={(e) => setConfirmPassword(e.target.value)}/> 


					<input className="comp" placeholder='Mobile Number' id='mobileNumber' value={regMobile} 
							type='text'
							onChange={(e) => setRegMobileNumber(e.target.value)}/> 
				
					<button className="comp"
							style={{height: '40px', width: '100%'}} 
							onClick={handleSignup}>Sign Up 
					</button> 

					<div className="text-center"> 
						<p>Already Register? <a href="/">Login</a></p> 
					</div> 

				</form> 
			</div> 
		</div> 
	); 
} 

export default SignupPage; 
