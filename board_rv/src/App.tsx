import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import BoardHeader from "./components/BoardHeader";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import PostNewPage from "./pages/PostNewPage";
import PostForm from "./components/PostForm";
import { AuthProvider } from "./context/AuthContext"; // 추가

const App: React.FC = () => (
    <AuthProvider> {/* 추가 */}
        <BrowserRouter>
            <BoardHeader/>
            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/posts/:id" element={<PostPage/>}/>
                    <Route path="/posts/:id/edit" element={<PostForm isEdit={true}/>}/>
                    <Route path="/new" element={<PostNewPage/>}/>
                </Routes>
            </main>
        </BrowserRouter>
    </AuthProvider>
);

export default App;
