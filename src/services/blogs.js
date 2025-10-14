import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const setToken = jwt => {
    token = `Bearer ${jwt}`
}

const create = async newBlog => {
    const options = {
        headers: { Authorization: token }
    }
    console.log('new Blog: ', newBlog)
    console.log('config: ', options)

    const response = await axios.post(baseUrl, newBlog, options)
    return response.data
}

export default { getAll, create, setToken }