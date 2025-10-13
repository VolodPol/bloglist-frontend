import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const setToken = jwt => {
    token = `Bearer ${jwt}`
}

const login = user => {
    const options = {
        headers: { Authorization: token }
    }

    return axios.post('/api/login', user, options)
        .then(response => response.data)
}

export default { getAll, login, setToken }