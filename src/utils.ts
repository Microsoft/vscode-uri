/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { CharCode } from './charCode';
import { URI } from './uri';
import * as nodePath from 'path';

const posixPath = nodePath.posix || nodePath;

export namespace Utils {

    /**
     * Joins one or more input paths to the path of URI. 
     * '/' is used as the directory separation character. 
     * 
     * The resolved path will be normalized. That means:
     *  - all '..' and '.' segments are resolved.
     *  - multiple, sequential occurences of '/' are replaced by a single instance of '/'.
     *  - trailing separators are preserved.
     * 
     * @param uri The input URI.
     * @param paths The paths to be joined with the path of URI.
     * @returns A URI with the joined path. All other properties of the URI (scheme, authority, query, fragments, ...) will be taken from the input URI.
     */
    export function joinPath(uri: URI, ...paths: string[]): URI {
        return uri.with({ path: posixPath.join(uri.path, ...paths) });
    }


    /**
     * Resolves one or more paths against the path of a URI. 
     * '/' is used as the directory separation character. 
     * 
     * The resolved path will be normalized. That means:
     *  - all '..' and '.' segments are resolved. 
     *  - multiple, sequential occurences of '/' are replaced by a single instance of '/'.
     *  - trailing separators are removed.
     * 
     * @param uri The input URI.
     * @param paths The paths to resolve against the path of URI.
     * @returns A URI with the resolved path. All other properties of the URI (scheme, authority, query, fragments, ...) will be taken from the input URI.
     */
    export function resolvePath(uri: URI, ...paths: string[]): URI {
        const path = uri.path || '/'; // normalize the path which is necessary as for posixPath.resolve the first segments has to be absolute or cwd is used.
        return uri.with({ path: posixPath.resolve(path, ...paths) });
    }

    /**
     * Returns a URI where the path is the directory name of the input uri, similar to the Unix dirname command. 
     * In the path, '/' is recognized as the directory separation character. Trailing directory separators are ignored.
     * The orignal URI is returned if the URIs path is empty or does not contain any path segments.
     * 
     * @param uri The input URI.
     * @return The last segment of the URIs path.
     */
    export function dirname(uri: URI): URI {
        let path = posixPath.dirname(uri.path);
        if (path.length === 1 && path.charCodeAt(0) === CharCode.Period) {
            return uri;
        }
        return uri.with({ path });
    }

    /**
     * Returns the last segment of the path of a URI, similar to the Unix basename command. 
     * In the path, '/' is recognized as the directory separation character. Trailing directory separators are ignored.
     * The empty string is returned if the URIs path is empty or does not contain any path segments.
     * 
     * @param uri The input URI.
     * @return The base name of the URIs path.
     */
    export function basename(uri: URI): string {
        return posixPath.basename(uri.path);
    }

    /**
     * Returns the extension name of the path of a URI, similar to the Unix extname command. 
     * In the path, '/' is recognized as the directory separation character. Trailing directory separators are ignored.
     * The empty string is returned if the URIs path is empty or does not contain any path segments.
     * 
     * @param uri The input URI.
     * @return The extension name of the URIs path.
     */
    export function extname(uri: URI): string {
        return posixPath.extname(uri.path);
    }
}