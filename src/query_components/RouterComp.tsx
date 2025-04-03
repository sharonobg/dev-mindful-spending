"use client"
import { QueryClient } from "@tanstack/react-query";
import{Outlet,rootRouteWithContext,createRouter} from "@tanstack/react-router"
interface MyRouterContext {
    queryClient:QueryClient;}
