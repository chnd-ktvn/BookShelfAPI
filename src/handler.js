const { nanoid } = require('nanoid')
const books = require('./books')

// POST
const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload
  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }
  books.push(newBook)
  const isExist = books.filter((book) => book.id === id).length > 0
  const failText = 'Gagal menambahkan buku.'
  if (isExist && name && readPage <= pageCount) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  } else if (!name) {
    books.pop()
    const response = h.response({
      status: 'fail',
      message: `${failText} Mohon isi nama buku`
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    books.pop()
    const response = h.response({
      status: 'fail',
      message: `${failText} readPage tidak boleh lebih besar dari pageCount`
    })
    response.code(400)
    return response
  }
  // general error
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan.'
  })
  response.code(500)
  return response
}

// GET
const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query
  if (name) {
    const booksByName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    const listBook = booksByName.map((book) => {
      return {
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }
    })
    return {
      status: 'success',
      data: {
        books: listBook
      }
    }
  } else if (reading === '1') {
    const booksByReading = books.filter((book) => book.reading === true)
    const listBook = booksByReading.map((book) => {
      return {
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }
    })
    return {
      status: 'success',
      data: {
        books: listBook
      }
    }
  } else if (reading === '0') {
    const booksByNotReading = books.filter((book) => book.reading === false)
    const listBook = booksByNotReading.map((book) => {
      return {
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }
    })
    return {
      status: 'success',
      data: {
        books: listBook
      }
    }
  } else if (finished === '1') {
    const booksByFinished = books.filter((book) => book.finished === true)
    const listBook = booksByFinished.map((book) => {
      return {
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }
    })
    return {
      status: 'success',
      data: {
        books: listBook
      }
    }
  } else if (finished === '0') {
    const booksByNotFinished = books.filter((book) => book.finished === false)
    const listBook = booksByNotFinished.map((book) => {
      return {
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }
    })
    return {
      status: 'success',
      data: {
        books: listBook
      }
    }
  }
  const listBook = books.map((book) => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }
  })
  return {
    status: 'success',
    data: {
      books: listBook
    }
  }
}

// GET BY ID
const getBookById = (request, h) => {
  const { id } = request.params
  const isExist = books.filter((book) => book.id === id)[0]
  if (isExist) {
    return {
      status: 'success',
      data: {
        book: isExist
      }
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

// EDIT BY ID
const editBookById = (request, h) => {
  const { id } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === id)
  const failText = 'Gagal memperbarui buku.'
  if (index !== -1 && name && readPage <= pageCount) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    return {
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }
  } else if (!name) {
    const response = h.response({
      status: 'fail',
      message: `${failText} Mohon isi nama buku`
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: `${failText} readPage tidak boleh lebih besar dari pageCount`
    })
    response.code(400)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: `${failText} Id tidak ditemukan`
  })
  response.code(404)
  return response
}

// DELETE BY ID
const deleteBookById = (request, h) => {
  const { id } = request.params
  const index = books.findIndex((book) => book.id === id)
  if (index !== -1) {
    books.splice(index, 1)
    return {
      status: 'success',
      message: 'Buku berhasil dihapus'
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan.'
  })
  response.code(404)
  return response
}

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById
}
