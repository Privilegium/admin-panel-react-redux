import { Formik, Form, Field } from "formik";
import * as Yup from 'yup'
import { v4 as uuidv4 } from 'uuid';

import { useDispatch, useSelector } from "react-redux";

import { useHttp } from '../../hooks/http.hook';
import { heroCreated, heroesFetchingError } from "../heroesList/heroesSlice";
import { selectAll } from "../heroesFilters/filtersSlice";
import store from "../../store";
// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const { filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState())
    const {request} = useHttp();
    const dispatch = useDispatch();
    
    const renderOptionsList = (arr, status) => {
        if (status === 'loading') {
            return <option>Loading...</option>
        } else if (status === 'error') {
            return <option>Loading error</option>
        }

        if (arr && arr.length > 0) {    
            return arr.map(({name, text}) => {
                if (name !== 'all') {
                    return <option key={name} value={name}>{text}</option>
                }
            })
        }
    }

    return (
        <Formik
            initialValues={{
                name: '',
                text: '',
                element: ''
            }}
            validationSchema={Yup.object({
                name: Yup.string()
                        .min(2, 'Minimum 2 symbols')
                        .required('Required field'),
                text: Yup.string()
                        .max(50, 'Maximum 50 symbols')
                        .required('Required field'),
                element: Yup.string().required('Choose the element')
            })}
            onSubmit={(values, {resetForm}) => {
                
                const {name, text, element} = values;
                const newHero = {
                    id: uuidv4(),
                    name: name,
                    description: text,
                    element: element
                }
                
                request('http://localhost:3001/heroes', 'POST', JSON.stringify(newHero))
                    .then(res => console.log(res, 'Hero created'))
                    .then(dispatch(heroCreated(newHero)))
                    .catch(() => dispatch(heroesFetchingError()))
                
                resetForm();
            }}
        >
            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field 
                        required
                        type="text" 
                        name="name" 
                        className="form-control" 
                        id="name" 
                        placeholder="Как меня зовут?"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="text" className="form-label fs-4">Описание</label>
                    <Field
                        required
                        name="text" 
                        className="form-control" 
                        id="text" 
                        placeholder="Что я умею?"
                        style={{"height": '130px'}}/>
                </div>

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                    <Field 
                        required
                        className="form-select" 
                        id="element" 
                        name="element"
                        as='select'>
                            <option >I have a power of ... element</option>
                            {renderOptionsList(filters, filtersLoadingStatus)}
                    </Field>
                </div>

                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>
    )
}

export default HeroesAddForm;