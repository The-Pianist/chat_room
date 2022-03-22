import React,{useState, useContext} from 'react'
import {useHistory} from 'react-router-dom';
import {UserContext} from "../../UserContext";

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const history=useHistory();
  const [name, setName]=useState('');
  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');
  const submitHandler=async(e)=>{
    e.preventDefault();
    console.log(name,email,password);
    try{
        const res=await fetch("http://localhost:8000/login",{
            method:"POST",
            body:JSON.stringify({email,password}),
            headers:{"Content-type":"application/json" },
        })
        console.log("Sign up success", res);
        const data=await res.json();
        if(data.user){
            setUser(data.user);
            history.push('/');
        }
    }catch(error){
        console.log(error)
    }
  }
  return (
    <div className="row">
        <h2>Login</h2>
            <form className="col s12" onSubmit={submitHandler}>
                <div className="row">
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <input id="email" type="email" className="validate"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <div className="email error red-text"></div>
                        <label htmlFor="email">Email</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <input id="password" type="password" className="validate"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <div className="password error red-text"></div>
                        <label htmlFor="password">Password</label>
                    </div>
                </div>

                <button className="btn">Login</button>
            </form>
        </div>

  )
}

export default Login