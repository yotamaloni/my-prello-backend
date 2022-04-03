const express = require('express')

const { requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')

const { getBoards, getBoardById, addBoard, updateBoard, removeBoard } = require('./board.controller')
const router = express.Router()

router.get('/', log, getBoards)

router.get('/:id', getBoardById)

router.post('/', addBoard)

router.put('/:id', updateBoard)

router.delete('/:id', requireAdmin, removeBoard)

module.exports = router