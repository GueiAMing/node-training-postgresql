const express = require('express')
const bcrypt = require('bcrypt')
const { validate: isUUID } = require('uuid');

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Coaches')

const saltRounds = 10

function isUndefined (value) {
  return value === undefined
}

function isNotValidSting (value) {
  return typeof value !== 'string' || value.trim().length === 0 || value === ''
}


// 新增使用者
router.get('/', async (req, res, next) => {
  console.log(req.query)
  per = req.query['per']
  page = req.query['page']
  console.log(per)
  console.log(typeof page)

  try {
    console.log("in coaches")
    const coach = await dataSource.getRepository('Coach').find({
      relations:["User"],
      select: {
        id: true,           // 選擇 Coach 的 id
        User:{
          name: true
        }
      }
    });
    const result = coach.map(coach => ({
      id: coach.id,
      name: coach.User.name
    }));
    res.status(200).json({
      status: 'success',
      data: result
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
})

router.get('/:coachId', async (req, res, next) => {
  console.log(req.params)
  coachId = req.params["coachId"]

  try {

      // 使用 uuid 套件驗證
    if (!isUUID(coachId)) {
      return res.status(400).json({
        status: "failed",
        message: "欄位未填寫正確"
      });
    }
    console.log("in coaches")
    const coach = await dataSource.getRepository('Coach').find({
      relations:["User"],
      where:{id : coachId},
      select:{
        User:{
          name:true,
          role:true
        }
      }
    });

    console.log("123",typeof coach)
    if (coach.length === 0) {
      logger.warn('找不到該教練')
      res.status(404).json({
        status: 'failed',
        message: '找不到該教練'
      })
      return
    }
    console.log(coach);
    coach_data = coach[0];
    const result ={}
    result['user'] = coach_data.User;
    delete coach_data.User;
    result['coach'] = coach_data;

    console.log(result)
    // const result = coach.map(coach => ({
    //   user: coach.User,
    //   coach: coach
    // }));
    res.status(200).json({
      status: 'success',
      data: result
    })
  } catch (error) {
    logger.error(error)
    next(error)
  }
})

module.exports = router