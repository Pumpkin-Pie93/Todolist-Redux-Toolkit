import React, { useCallback, useEffect } from "react"
import { TodolistsList } from "features/TodolistsList/ui/TodolistsList"
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar"
import { useSelector } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Login } from "features/Login/ui/Login"
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material"
import { Menu } from "@mui/icons-material"
import { selectorIsInitialized, selectorIsLoggedIn, selectorStatus } from "app/app-selectors"
import { useActions } from "common/hooks/useActions"

type PropsType = {
  demo?: boolean
}

function App({ demo = false }: PropsType) {
  const status = useSelector(selectorStatus)
  const isInitialized = useSelector(selectorIsInitialized)
  const isLoggedIn = useSelector(selectorIsLoggedIn)
  const { initializeApp, logout } = useActions()

  useEffect(() => {
    initializeApp()
  }, [])

  const logoutHandler = useCallback(() => {
    logout()
  }, [])

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="App">
        <ErrorSnackbar />
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6">News</Typography>
            {isLoggedIn && (
              <Button color="inherit" onClick={logoutHandler}>
                Log out
              </Button>
            )}
          </Toolbar>
          {status === "loading" && <LinearProgress />}
        </AppBar>
        <Container fixed>
          <Routes>
            <Route path={"/"} element={<TodolistsList demo={demo} />} />
            <Route path={"/login"} element={<Login />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  )
}

export default App
