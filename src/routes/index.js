import React from 'react'
import { Home, NotFound } from '../pages'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/:param" element={<Home />} />
        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router