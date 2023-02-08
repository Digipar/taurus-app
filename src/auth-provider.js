// pretend this is firebase, netlify, or auth0's code.
// you shouldn't have to implement something like this in your own app
import { API} from './config';

const localStorageKey = '__auth_provider_token__'
const localStorageUserData = '__auth_provider_user_data__'

async function getToken() {
  // if we were a real auth provider, this is where we would make a request
  // to retrieve the user's token. (It's a bit more complicated than that...
  // but you're probably not an auth provider so you don't need to worry about it).
  return await window.localStorage.getItem(localStorageKey)
  // await Promise.resolve(window.localStorage.getItem(localStorageKey))
}

async function getUserFromToken(token) {
  // if we were a real auth provider, this is where we would make a request
  // to retrieve the user's information. (It's a bit more complicated than that...
  // but you're probably not an auth provider so you don't need to worry about it).
  return await window.localStorage.getItem(localStorageUserData)
  // await Promise.resolve(window.localStorage.getItem(localStorageUserData))
}

function handleUserResponse({user}) {
  console.log('user', user)
  window.localStorage.setItem(localStorageKey, user.token)
  window.localStorage.setItem(localStorageUserData, user.username)
  return user
}

async function  login({UsuarioEmail, UsuarioPassword}) {

  let bodyAEnviar={
    UsuarioEmail: UsuarioEmail,
    UsuarioPassword: UsuarioPassword
  }
  console.log('login called', bodyAEnviar)
  try {
  const requestOptions = {
    method: "POST", 
    body:JSON.stringify(bodyAEnviar),
    headers: { "Content-Type": "application/json" }
  }
  const user = await fetch(`${API}/login`, requestOptions);

    if (!user.ok) {
      return {}
    }  
  
    const userJSON = await user.json();
    const token = Math.random().toString(36).substr(2);
    return handleUserResponse({user: {token,usuarioNombre: userJSON.usuarioNombre,userId: userJSON.userId,UsuarioEmail: userJSON.UsuarioEmail}})
  }
  catch(error){
    console.log('error', error)
  } 

}

function register({username, UsuarioPassword}) {
  return client('register', {username, UsuarioPassword}).then(handleUserResponse)
}

async function logout() {
  window.localStorage.removeItem(localStorageKey)
}

const authURL = process.env.REACT_APP_AUTH_URL || 'http://localhost:8080'

async function client(endpoint, data) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
    'Content-Type': 'application/json'},
 
  }

  return window.fetch(`${authURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {getToken, getUserFromToken, login, register, logout, localStorageKey}