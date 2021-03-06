import React, { Component } from "react";
import { RouterContext } from "./BrowserRouter";
import matchPath from "./matchPath";
export default class Route extends Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context => {
                    const location = this.props.location || context.location;
                    const match = this.props.computedMatch
                        ? this.props.computedMatch // <Switch> already computed the match for us
                        : this.props.path
                            ? matchPath(location.pathname, this.props)
                            : context.match;
                    const props = { ...context, location, match };
                    let { children, component, render } = this.props;
                    // 若未传递children属性，则默认为null
                    if (Array.isArray(children) && children.length === 0) {
                        children = null;
                    }
                    if (typeof children === "function") {
                        children = children(props);
                    }
                    return (
                        <RouterContext.Provider value={props}>
                            {children && React.Children.count(children) > 0
                                ? children
                                : props.match
                                    ? component
                                        ? React.createElement(component, props)
                                        : render
                                            ? render(props)
                                            : null
                                    : null}
                        </RouterContext.Provider>
                    );
                }}
            </RouterContext.Consumer>
        );
    }
}

// 依赖matchPath.js

import pathToRegexp from "path-to-regexp";
const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;
function compilePath(path, options) {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
    const pathCache = cache[cacheKey] || (cache[cacheKey] = {});
    if (pathCache[path]) return pathCache[path];
    const keys = [];
    const regexp = pathToRegexp(path, keys, options);
    const result = { regexp, keys };
    if (cacheCount < cacheLimit) {
        pathCache[path] = result;
        cacheCount++;
    }
    return result;
}
function matchPath(pathname, options = {}) {
    if (typeof options === "string") options = { path: options };
    const { path, exact = false, strict = false, sensitive = false } =
        options;
    const paths = [].concat(path);
    return paths.reduce((matched, path) => {
        if (!path) return null;
        if (matched) return matched;
        const { regexp, keys } = compilePath(path, {
            end: exact,
            strict,
            sensitive
        });
        const match = regexp.exec(pathname);
        if (!match) return null;
        const [url, ...values] = match;
        const isExact = pathname === url;
        if (exact && !isExact) return null;
        return {
            path, // the path used to match
            url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
            isExact, // whether or not we matched exactly
            params: keys.reduce((memo, key, index) => {
                memo[key.name] = values[index];
                return memo;
            }, {})
        };
    }, null);
}
export default matchPath;