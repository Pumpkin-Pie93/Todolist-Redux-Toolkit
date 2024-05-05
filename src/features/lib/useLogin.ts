import { useAppDispatch } from "../../common/hooks/useAppDispatch"
import { useSelector } from "react-redux"
import { selectorIsLoggedIn } from "../../app/app-selectors"
import { useFormik } from "formik"
import { authThunks } from "../Login/authSlice"
import { BaseResponseType } from "../../common/types"
import { LoginParamsType } from "../TodolistsList/todolists-api"

type FormikErrorsType = Omit<Partial<LoginParamsType>,'captcha'>

export const useLogin = () => {
  const dispatch = useAppDispatch()

  const isLoggedIn = useSelector(selectorIsLoggedIn)

  const formik = useFormik({
    validate: (values) => {
      const errors: FormikErrorsType = {}
      if (!values.email) {
          errors.email = "Email is required"
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2-4}$/i.test(values.email)){
        errors.email = 'Invalid email address'
      }
      if (!values.password) {
          errors.password = "Required"
      } else if (values.password.length < 3){
        errors.password = 'Must be 3 characters or more'
      }
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: (data, formikHelpers) => {
      dispatch(authThunks.login({ data }))
        .unwrap()
        .then((res) => {})
        .catch((e: BaseResponseType) => {
          if (e.fieldsErrors) {
            e.fieldsErrors.forEach((el) => {
              formikHelpers.setFieldError(el.field, el.error)
            })
          }
        })
    },
  })
  return {
    isLoggedIn,
    formik
  }
}
