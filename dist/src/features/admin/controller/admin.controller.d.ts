/// <reference types="qs" />
/// <reference types="node" />
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AdminUserService } from '../service/admin-user.service';
import { Response } from 'express';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponseDTO } from 'src/shared/response/api-response';
import { CreateRoleDto } from '../dto/create-role.dto';
import { AdminRoleService } from '../service/admin-role.service';
export declare class AdminController {
    private adminService;
    private adminRoleService;
    constructor(adminService: AdminUserService, adminRoleService: AdminRoleService);
    createAdmin(user: CreateUserDto, res: Response): Promise<{
        status(code: number): Response<any, Record<string, any>>;
        sendStatus(code: number): Response<any, Record<string, any>>;
        links(links: any): Response<any, Record<string, any>>;
        send: import("express-serve-static-core").Send<any, Response<any, Record<string, any>>>;
        json: import("express-serve-static-core").Send<any, Response<any, Record<string, any>>>;
        jsonp: import("express-serve-static-core").Send<any, Response<any, Record<string, any>>>;
        sendFile(path: string, fn?: import("express-serve-static-core").Errback): void;
        sendFile(path: string, options: import("express-serve-static-core").SendFileOptions, fn?: import("express-serve-static-core").Errback): void;
        sendfile(path: string): void;
        sendfile(path: string, options: import("express-serve-static-core").SendFileOptions): void;
        sendfile(path: string, fn: import("express-serve-static-core").Errback): void;
        sendfile(path: string, options: import("express-serve-static-core").SendFileOptions, fn: import("express-serve-static-core").Errback): void;
        download(path: string, fn?: import("express-serve-static-core").Errback): void;
        download(path: string, filename: string, fn?: import("express-serve-static-core").Errback): void;
        download(path: string, filename: string, options: import("express-serve-static-core").DownloadOptions, fn?: import("express-serve-static-core").Errback): void;
        contentType(type: string): Response<any, Record<string, any>>;
        type(type: string): Response<any, Record<string, any>>;
        format(obj: any): Response<any, Record<string, any>>;
        attachment(filename?: string): Response<any, Record<string, any>>;
        set(field: any): Response<any, Record<string, any>>;
        set(field: string, value?: string | string[]): Response<any, Record<string, any>>;
        header(field: any): Response<any, Record<string, any>>;
        header(field: string, value?: string | string[]): Response<any, Record<string, any>>;
        headersSent: boolean;
        get(field: string): string;
        clearCookie(name: string, options?: import("express-serve-static-core").CookieOptions): Response<any, Record<string, any>>;
        cookie(name: string, val: string, options: import("express-serve-static-core").CookieOptions): Response<any, Record<string, any>>;
        cookie(name: string, val: any, options: import("express-serve-static-core").CookieOptions): Response<any, Record<string, any>>;
        cookie(name: string, val: any): Response<any, Record<string, any>>;
        location(url: string): Response<any, Record<string, any>>;
        redirect(url: string): void;
        redirect(status: number, url: string): void;
        redirect(url: string, status: number): void;
        render(view: string, options?: object, callback?: (err: Error, html: string) => void): void;
        render(view: string, callback?: (err: Error, html: string) => void): void;
        locals: Record<string, any> & import("express-serve-static-core").Locals;
        charset: string;
        vary(field: string): Response<any, Record<string, any>>;
        app: import("express-serve-static-core").Application<Record<string, any>>;
        append(field: string, value?: string | string[]): Response<any, Record<string, any>>;
        req: import("express-serve-static-core").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
        statusCode: number;
        statusMessage: string;
        strictContentLength: boolean;
        chunkedEncoding: boolean;
        shouldKeepAlive: boolean;
        useChunkedEncodingByDefault: boolean;
        sendDate: boolean;
        finished: boolean;
        connection: import("net").Socket;
        socket: import("net").Socket;
        writable: boolean;
        writableEnded: boolean;
        writableFinished: boolean;
        writableHighWaterMark: number;
        writableLength: number;
        writableObjectMode: boolean;
        writableCorked: number;
        destroyed: boolean;
        closed: boolean;
        errored: Error;
        writableNeedDrain: boolean;
        off(eventName: string | symbol, listener: (...args: any[]) => void): Response<any, Record<string, any>>;
        removeAllListeners(event?: string | symbol): Response<any, Record<string, any>>;
        setMaxListeners(n: number): Response<any, Record<string, any>>;
        getMaxListeners(): number;
        listeners(eventName: string | symbol): Function[];
        rawListeners(eventName: string | symbol): Function[];
        listenerCount(eventName: string | symbol, listener?: Function): number;
        eventNames(): (string | symbol)[];
    }>;
    getAllUsers(headers: any): Promise<ApiResponseDTO<User[]>>;
    getUsersByRoleId(roleId: string): Promise<{
        data?: User[];
        message?: any;
        statusCode?: number;
    }>;
    deleteUserById(id: string): Promise<ApiResponseDTO<User>>;
    createRole(role: CreateRoleDto, res: Response): Promise<{
        status(code: number): Response<any, Record<string, any>>;
        sendStatus(code: number): Response<any, Record<string, any>>;
        links(links: any): Response<any, Record<string, any>>;
        send: import("express-serve-static-core").Send<any, Response<any, Record<string, any>>>;
        json: import("express-serve-static-core").Send<any, Response<any, Record<string, any>>>;
        jsonp: import("express-serve-static-core").Send<any, Response<any, Record<string, any>>>;
        sendFile(path: string, fn?: import("express-serve-static-core").Errback): void;
        sendFile(path: string, options: import("express-serve-static-core").SendFileOptions, fn?: import("express-serve-static-core").Errback): void;
        sendfile(path: string): void;
        sendfile(path: string, options: import("express-serve-static-core").SendFileOptions): void;
        sendfile(path: string, fn: import("express-serve-static-core").Errback): void;
        sendfile(path: string, options: import("express-serve-static-core").SendFileOptions, fn: import("express-serve-static-core").Errback): void;
        download(path: string, fn?: import("express-serve-static-core").Errback): void;
        download(path: string, filename: string, fn?: import("express-serve-static-core").Errback): void;
        download(path: string, filename: string, options: import("express-serve-static-core").DownloadOptions, fn?: import("express-serve-static-core").Errback): void;
        contentType(type: string): Response<any, Record<string, any>>;
        type(type: string): Response<any, Record<string, any>>;
        format(obj: any): Response<any, Record<string, any>>;
        attachment(filename?: string): Response<any, Record<string, any>>;
        set(field: any): Response<any, Record<string, any>>;
        set(field: string, value?: string | string[]): Response<any, Record<string, any>>;
        header(field: any): Response<any, Record<string, any>>;
        header(field: string, value?: string | string[]): Response<any, Record<string, any>>;
        headersSent: boolean;
        get(field: string): string;
        clearCookie(name: string, options?: import("express-serve-static-core").CookieOptions): Response<any, Record<string, any>>;
        cookie(name: string, val: string, options: import("express-serve-static-core").CookieOptions): Response<any, Record<string, any>>;
        cookie(name: string, val: any, options: import("express-serve-static-core").CookieOptions): Response<any, Record<string, any>>;
        cookie(name: string, val: any): Response<any, Record<string, any>>;
        location(url: string): Response<any, Record<string, any>>;
        redirect(url: string): void;
        redirect(status: number, url: string): void;
        redirect(url: string, status: number): void;
        render(view: string, options?: object, callback?: (err: Error, html: string) => void): void;
        render(view: string, callback?: (err: Error, html: string) => void): void;
        locals: Record<string, any> & import("express-serve-static-core").Locals;
        charset: string;
        vary(field: string): Response<any, Record<string, any>>;
        app: import("express-serve-static-core").Application<Record<string, any>>;
        append(field: string, value?: string | string[]): Response<any, Record<string, any>>;
        req: import("express-serve-static-core").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
        statusCode: number;
        statusMessage: string;
        strictContentLength: boolean;
        chunkedEncoding: boolean;
        shouldKeepAlive: boolean;
        useChunkedEncodingByDefault: boolean;
        sendDate: boolean;
        finished: boolean;
        connection: import("net").Socket;
        socket: import("net").Socket;
        writable: boolean;
        writableEnded: boolean;
        writableFinished: boolean;
        writableHighWaterMark: number;
        writableLength: number;
        writableObjectMode: boolean;
        writableCorked: number;
        destroyed: boolean;
        closed: boolean;
        errored: Error;
        writableNeedDrain: boolean;
        off(eventName: string | symbol, listener: (...args: any[]) => void): Response<any, Record<string, any>>;
        removeAllListeners(event?: string | symbol): Response<any, Record<string, any>>;
        setMaxListeners(n: number): Response<any, Record<string, any>>;
        getMaxListeners(): number;
        listeners(eventName: string | symbol): Function[];
        rawListeners(eventName: string | symbol): Function[];
        listenerCount(eventName: string | symbol, listener?: Function): number;
        eventNames(): (string | symbol)[];
    }>;
    updateRole(roleId: string, role: CreateRoleDto): Promise<{
        data?: import("../../role/entities/role.entity").Role;
        message?: any;
        statusCode?: number;
    }>;
    updateRolesForUser(userId: string, roleIds: string[]): Promise<ApiResponseDTO<User>>;
}
