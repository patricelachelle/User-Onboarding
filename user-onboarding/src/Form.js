import React, { useState, useEffect } from 'react';
import axios from 'axios'
import * as yup from 'yup'

export default function Form() {
    // managing state for our form inputs
    const [formState, setFormState] = useState({
        name: '',
        pronoun: '',
        email: '',
        password: '',
        roles: 'Customer Service Agent',
        terms: false
    })
    // server error
    const [serverError, setServerError] = useState('')

    // control whether or not the form can be submitted if there are errors in form validation (in the useEffect)
    const [buttonDisabled, setButtonDisabled] = useState(true)

    // managing state for errors...empty unless inline validation (validateInput) updates key/value pair to have error
    const [errors, setErrors] = useState({
        name: '',
        pronoun: '',
        email: '',
        password: '',
        roles: '',
        terms: ''
    })
    // temporary state used to display response from API...this is not a commonly used convention
    const [post, setPost] = useState([]);

    // inline validation, validating one key/value pair at a time
    const validateChange = (event) => {
      yup
      // get the rules out of schema with reach at key 'event.target.name'-->'formSchema[event.target.name]
       .reach(formSchema, event.target.name)
       .validate(event.target.type === 'checkbox' ? event.target.checked : event.target.value)
       .then(() => {
           // the input is passing
           // the reset of that input's error
           setErrors({ ...errors, [event.target.name]: ''})
       })
       .catch((err) => {
           // the input is breaking form schema
           // if failing validation, set error message into error state (this is used in JSX to display error)

           console.log('err', err);
           setErrors({ ...errors, [event.target.name]: err.errors[0] })
       })
   }
   // onSubmit function
   const formSubmit = (event) => {
       event.preventDefault(); // <form> onSubmit has default behavior from HTML

       // send out POST request with obj as second param, for us that is formState
       // trigger .catch by changing URL to 'https://regres.in/api/register'

       axios
         .post('https://reqres.in/api/users', formState)
         .then((response) => {
             // update temp state with value from API to display in <pre>
             setPost(response.data);

             // if successful request, clear any server errors
             setServerError(null);

             // clear state, could also use a predetermined initial state variable here
             setFormState({
                name: '',
                pronoun: '',
                email: '',
                password: '',
                roles: 'Customer Service Agent',
                terms: false  
             })
         })
         .catch(() => {
             // this is where we could create a server error in the form...if API request fails...ex, for authentication the user doesn't exist in the database
             setServerError('Error Message')
         })
   }
   // onChange function(changeHandler)
   const inputChange = (event) => {
       // use persist with async code -> we pass the event into validateChange that has async promise logic with .validate

       event.persist(); // necessary because we're passing the event asynchronously and we need it to exist even after this function completes (which will complete before validate finishes)
       // event.target.name --> name of the input that fired the event
       // event.target.value --> current value of the input that fired the event
       // event.target.type --> type attribute of the input

       const newFormState = {
           ...formState,
           [event.target.name]:
            event.target.type === 'checkbox' ? event.target.checked : event.target.value
       }
       validateChange(event); // for each change in input, do inline validation
       setFormState(newFormState) // update state with new data
   };

   // Add a schema, used for all validation to determine whether the input is valid or not
   const formSchema = yup.object().shape({
        name: yup.string().required('Name is required.'), // must be a string or else error
        pronoun: yup.string().required('Pronoun is required.'), // must have string present, must be shape of an email
        email: yup.string().email(),
        password: yup.string().required('Password is required.').min(6, 'Passwords must be at least 6 characters long.'), // throws error if password is not at least 6 characters
        roles: yup
            .string()
            .oneOf(['Customer Service Agent', 'Floor Supervisor', 'Help-Desk', 'Engineer']), // value must be one of the values in the array otherwise throws error
        terms: yup.boolean().oneOf([true])
   })

   // whenever state updates, validate the entire form, if valid, then change button to be enabled
   useEffect(() => {
       formSchema.isValid(formState).then((valid) => {
           console.log('Is form valid?', valid)

           // valid is a boolean
           // !true === false
           // !false === true
           // if the form is valid, and we take the opposite --> we do not want disable the button
           setButtonDisabled(!valid)
       })
   }, [formState, formSchema])
   console.log('formState', formState)
   return (
       <form onSubmit={formSubmit}>
           {serverError && <p className='error'>{serverError}</p>}
           <label htmlFor='name'>
               Name
                <input 
                id='name' 
                type='text' 
                name='name' 
                data-cy='name'
                value={formState.name}
                onChange={inputChange}
            />
           </label>
           {errors.name.length > 0 ? <p className='error'>{errors.name}</p> : null}
           <label htmlFor='pronoun'>
               Pronoun
                <input 
                id='pronoun' 
                type='text' 
                name='pronoun'
                data-cy='pronoun' 
                value={formState.pronoun}
                onChange={inputChange}
            />
           </label>
           {errors.pronoun.length > 0 ? <p className='error'>{errors.pronoun}</p> : null}
           <label htmlFor='email'>
               Email
               <input
                id='email'
                type='text'
                name='email'
                data-cy='email'
                value={formState.email}
                onChange={inputChange}
            />
           </label>
           {errors.email.length > 0 ? (
                    <p className='error'>{errors.email}</p>
                ) : null}
           <label htmlFor='password'>
               Password
               <input 
                id='password'
                type='text'
                name='password'
                data-cy='password'
                value={formState.password}
                onChange={inputChange}
            />
           </label>
           {errors.password.length > 0 &&
                    <p className='error'>{errors.password}</p>}
           <label htmlFor='roles'>
               Roles
               {/* multiselect with select HTML input with multiple attributes...value of option is what is passed into event.target.value when clicked...value of select is the way to keep formState in sync with the select...we can also use this to preset values as shown with  'Customer Service Agent'*/}
               <select
                 id='roles'
                 name='roles'
                 data-cy='roles'
                 value={formState.roles}
                 onChange={inputChange}
                 >
                  <option value=''>--Choose One--</option>
                  {/*event.target.value is value in <option> NOT <select>*/}
                  <option value='Customer Service Agent'>Customer Service Agent</option>
                  <option value='Floor Supervisor'>Floor Supervisor</option>
                  <option value='Help-Desk'>Help-Desk</option>
                  <option value='Engineer'>Engineer</option>
                 </select>
           </label>
           {errors.roles.length > 0 ? (
                     <p className='error'>{errors.roles}</p>
                 ) : null}
           <label htmlFor='terms' className='terms'>
               <input
                 type='checkbox'
                 id='terms'
                 name='terms'
                 data-cy='terms'
                 checked={formState.terms}
                 onChange={inputChange}
            />
                 Terms
           </label>
           {errors.terms.length > 0 ? (
                     <p className='error'>{errors.terms}</p>
                 ) : null}
           <button data-cy='submit' type='submit' disabled={buttonDisabled}>Submit</button>

           {/*Displays post request */}
           <pre>{JSON.stringify(post, null, 2)}</pre>
       </form>
   )
}