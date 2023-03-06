import * as React from 'react'
import {FullPageSpinner, FullPageErrorFallback} from '../components/lib'
import * as auth from '../auth-provider'
import {useAsync} from '../utils/hooks'


async function bootstrapAppData() {
  let user = null
  
  const token = await auth.getToken()
  if (token) {
    user = await auth.getUserFromToken(token)
  }
  return user
}
const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function AuthProvider(props) {
  const {data: user, error, isLoading, isIdle, isError, isSuccess, run, setData} = useAsync()
  // code for pre-loading the user's information if we have their token in
  // localStorage goes here
  React.useEffect(() => {
    const appDataPromise = bootstrapAppData()
    run(appDataPromise)
  }, [run])

  const login = React.useCallback(
    form => auth.login(form).then(user => setData(user)),
    [setData],
  )
  const register = React.useCallback(
    form => auth.register(form).then(user => setData(user)),
    [setData],
  )
  const logout = React.useCallback(() => {
    console.log('aca')
    auth.logout()
    setData(null)
  }, [setData])

  const value = React.useMemo(
    () => ({user, login, logout, register}),
    [login, logout, register, user],
  )
  // 🚨 this is the important bit.
  // Normally your provider components render the context provider with a value.
  // But we post-pone rendering any of the children until after we've determined
  // whether or not we have a user token and if we do, then we render a spinner
  // while we go retrieve that user's information.

  // if (weAreStillWaitingToGetTheUserData) {
if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }



  // const login = () => {

  // } // make a login request
  // const register = () => {} // register the user
  // const logout = () => {} // clear the token in localStorage and the user data

  // note, I'm not bothering to optimize this `value` with React.useMemo here
  // because this is the top-most component rendered in our app and it will very
  // rarely re-render/cause a performance problem.
  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />
  }
}

const useAuth = () => React.useContext(AuthContext)

export {AuthProvider, useAuth}

// the UserProvider in user-context.js is basically:
// const UserProvider = props => (
//   <UserContext.Provider value={useAuth().data.user} {...props} />
// )
// and the useUser hook is basically this:
// const useUser = () => React.useContext(UserContext)