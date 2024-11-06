import {Router, Request, Response} from 'express';
import {body, matchedData, param} from 'express-validator';
import handleValidationResult from '../../util/validation.js';
import PropertyService from './service.js';
import {StatusCodes} from 'http-status-codes';
import {Property} from "../../types/types.js";

const createPropertyValidationChain = () => [
    body('name')
        .isString().withMessage('Naziv mora biti tekstualni string')
        .isLength({min: 1}).withMessage('Naziv je obavezno polje'),
    body('description')
        .isString().withMessage('Opis mora biti tekstualni string')
        .isLength({min: 1}).withMessage('Opis je obavezno polje'),
    body('price')
        .isFloat({min: 0}).withMessage('Cijena mora biti pozitivan broj'),
    body('location')
        .isString().withMessage('Lokacija mora biti tekstualni string')
        .isLength({min: 1}).withMessage('Lokacija je obavezno polje'),
    body('numberOfRooms')
        .isInt({min: 0}).withMessage('Broj soba mora biti cijeli broj veći ili jednak nuli'),
    body('area')
        .isFloat({min: 0}).withMessage('Površina mora biti pozitivan broj')
];

const PropertyRouter = Router().post('',
    createPropertyValidationChain(),
    handleValidationResult,
    (request: Request<{}, {}, Property>, response: Response) => {
        const id = PropertyService.addProperty(matchedData(request));

        response.status(StatusCodes.CREATED).send({id});
    })
    .get('', (request: Request, response: Response) => {
        const properties = PropertyService.getAllProperties();

        response.send(properties);
    })
    .use('/:id',
        param('id').isUUID().withMessage('Nepravilan UUID nekretnine'),
        handleValidationResult,
        Router({mergeParams: true})
            .get('',
                (request: Request, response: Response) => {
                    const {id} = matchedData(request);
                    const property = PropertyService.getPropertyById(id);

                    response.send(property);
                })
            .put('',
                createPropertyValidationChain(),
                handleValidationResult,
                (request: Request, response: Response) => {
                    const {id, ...data} = matchedData(request);
                    const updatedProperty = PropertyService.updatePropertyById(id, data);

                    response.send(updatedProperty);
                })
            .patch('',
                createPropertyValidationChain().map(chain => chain.optional()),
                handleValidationResult,
                (request: Request, response: Response) => {
                    const {id, ...data} = matchedData(request);
                    const updatedProperty = PropertyService.updatePropertyById(id, data);

                    response.send(updatedProperty);
                })
            .delete('',
                (request: Request, response: Response) => {
                    const {id} = matchedData(request);

                    PropertyService.deletePropertyById(id);

                    response.sendStatus(StatusCodes.OK);
                })
    );

export default PropertyRouter;
