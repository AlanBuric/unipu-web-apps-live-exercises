import {Router, Response, Request} from "express";
import {body, matchedData, param} from 'express-validator';
import handleValidationResult from "../../util/validation.js";
import OfferService from "./service.js";
import {Offer} from "../../types/types.js";
import {StatusCodes} from "http-status-codes";
import PropertyService from "../property/service.js";

function createOfferValidationChain() {
    return [
        body('propertyId')
            .isUUID().withMessage('ID nekretnine mora biti valjani UUID')
            .custom(({value}) => PropertyService.getPropertyById(value))
            .withMessage(({value}) => `Nekretnina s ID-jem ${value} ne postoji`),
        body('customerFirstName')
            .isString().withMessage('Ime kupca mora biti tekstualni string')
            .isLength({min: 1}).withMessage('Ime kupca je obavezno polje'),
        body('customerLastName')
            .isString().withMessage('Prezime kupca mora biti tekstualni string')
            .isLength({min: 1}).withMessage('Prezime kupca je obavezno polje'),
        body('offerPrice')
            .isFloat({min: 0}).withMessage('Ponuđena cijena mora biti pozitivan broj'),
        body('customerPhone')
            .isString().withMessage('Broj telefona kupca mora biti tekstualni string')
            .matches(/^\+?[0-9]{7,15}$/).withMessage('Broj telefona mora biti valjan')
    ]
}

const mandatoryFieldValidation = createOfferValidationChain();
const optionalFieldValidation = createOfferValidationChain().map(chain => chain.optional());

const OfferRouter = Router().post("",
    mandatoryFieldValidation,
    handleValidationResult,
    (request: Request<{}, {}, Offer>, response: Response) => {
        const id = OfferService.addOffer(matchedData(request));

        response.sendStatus(StatusCodes.CREATED).send({id});
    })
    .get("", (request: Request, response: Response): any => response.send(OfferService.getAllOffers()))
    .use("/:id",
        param("id").isUUID().withMessage("Nepravilan UUID ponude"),
        handleValidationResult,
        Router({mergeParams: true})
            .get("",
                (request: Request, response: Response) => {
                    const {id} = matchedData(request);

                    response.send(OfferService.getOfferById(id));
                })
            .put("",
                mandatoryFieldValidation,
                (request: Request, response: Response) => {
                    const {id, ...data} = matchedData(request);
                    const updatedOffer = OfferService.updateOfferById(id, data);

                    response.send(updatedOffer);
                })
            .patch("",
                optionalFieldValidation,
                (request: Request, response: Response) => {
                    const {id, ...data} = matchedData(request);
                    const updatedOffer = OfferService.updateOfferById(id, data);

                    response.send(updatedOffer);
                })
            .delete("", (request: Request, response: Response) => {
                const {id} = matchedData(request);

                OfferService.deleteOfferById(id);

                response.sendStatus(StatusCodes.OK);
            })
    );

export default OfferRouter;