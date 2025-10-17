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
    const config = { headers: { Authorization: token } }
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
}

const update = async updated => {
    const { id } = updated
    return (await axios.put(`${baseUrl}/${id}`, updated)).data
}

const remove = async id => {
    const config = { headers: { Authorization: token } }
    await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, setToken, update, remove }