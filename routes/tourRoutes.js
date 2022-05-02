const express = require('express')

const router = express.Router()

const tourController = require('../controllers/tourController')

//router.param('id',tourController.checkID)
router
    .route("/tour-5-cheap")
    .get(tourController.cheapTopFive,tourController.getAllTours)
router
    .route("/")
    .get(tourController.getAllTours)
    .post(tourController.createTour)

router
    .route("/:id")
    .get(tourController.getTour)
    .patch(tourController.updateTour)
     .delete(tourController.deleteTour)

module.exports=router
