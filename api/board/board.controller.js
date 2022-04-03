const socketService = require('../../services/socket.service.js');

const boardService = require('./board.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getBoards(req, res) {
  try {
    let { filterBy } = req.query
    if (!filterBy) filterBy = null
    else filterBy = JSON.parse(filterBy)
    const boards = await boardService.query(filterBy)
    res.json(boards);
  } catch (err) {
    logger.error('Failed to get boards', err)
    res.status(500).send({ err: 'Failed to get boards' })
  }
}

// GET BY ID 
async function getBoardById(req, res) {
  try {
    const boardId = req.params.id;
    const board = await boardService.getById(boardId)
    res.json(board)
  } catch (err) {
    logger.error('Failed to get board', err)
    res.status(500).send({ err: 'Failed to get board' })
  }
}

// POST (add board)
async function addBoard(req, res) {
  try {
    const board = req.body;
    const addedBoard = await boardService.add(board)
    socketService.boardsAfterAddBoard(addedBoard)
    res.json(addedBoard)
  } catch (err) {
    logger.error('Failed to add board', err)
    res.status(500).send({ err: 'Failed to add board' })
  }
}

async function updateBoard(req, res) {
  try {
    const board = req.body;
    const updatedBoard = await boardService.update(board)
    res.json(updatedBoard)
  } catch (err) {
    logger.error('Failed to update board', err)
    res.status(500).send({ err: 'Failed to update board' })

  }
}

async function removeBoard(req, res) {
  try {
    const boardId = req.params.id;
    const removedId = await boardService.remove(boardId)
    socketService.boardsAfterRemove(removedId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove board', err)
    res.status(500).send({ err: 'Failed to remove board' })
  }
}

module.exports = {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard
}
