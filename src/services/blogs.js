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
    const response = await axios.post(baseUrl, newBlog, options)
    return response.data
}

const update = async updated => {
    const { id } = updated
    return (await axios.put(`${baseUrl}/${id}`, updated)).data
}

export default { getAll, create, setToken, update }