"use strict";(self.webpackChunkfenix_finance=self.webpackChunkfenix_finance||[]).push([[694],{"./node_modules/@mdx-js/react/lib/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{R:()=>useMDXComponents,x:()=>MDXProvider});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/next/dist/compiled/react/index.js");const emptyComponents={},MDXContext=react__WEBPACK_IMPORTED_MODULE_0__.createContext(emptyComponents);function useMDXComponents(components){const contextComponents=react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext);return react__WEBPACK_IMPORTED_MODULE_0__.useMemo((function(){return"function"==typeof components?components(contextComponents):{...contextComponents,...components}}),[contextComponents,components])}function MDXProvider(properties){let allComponents;return allComponents=properties.disableParentContext?"function"==typeof properties.components?properties.components(emptyComponents):properties.components||emptyComponents:useMDXComponents(properties.components),react__WEBPACK_IMPORTED_MODULE_0__.createElement(MDXContext.Provider,{value:allComponents},properties.children)}},"./node_modules/@storybook/addon-docs/dist/blocks.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{W8:()=>_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__.W8});var _storybook_client_logger__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("@storybook/client-logger"),_storybook_blocks__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs");(0,_storybook_client_logger__WEBPACK_IMPORTED_MODULE_0__.deprecate)("Import from '@storybook/addon-docs/blocks' is deprecated. Please import from '@storybook/blocks' instead.")},"./src/stories/Colors/Colors.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>MDXContent});__webpack_require__("./node_modules/next/dist/compiled/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/next/dist/compiled/react/jsx-runtime.js"),C_Users_Jose_Santana_Documents_Repositorios_esthetiqo_fenix_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim_mjs__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/@mdx-js/react/lib/index.js"),_storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@storybook/addon-docs/dist/blocks.mjs"),___WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/stories/Colors/index.tsx"),_colors_ts__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/stories/Colors/colors.ts");__webpack_require__("./src/assets/styles/globals.css");function _createMdxContent(props){const _components={h1:"h1",p:"p",...(0,C_Users_Jose_Santana_Documents_Repositorios_esthetiqo_fenix_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim_mjs__WEBPACK_IMPORTED_MODULE_6__.R)(),...props.components};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_addon_docs_blocks__WEBPACK_IMPORTED_MODULE_2__.W8,{title:"Design System/Colors",component:___WEBPACK_IMPORTED_MODULE_3__.A}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h1,{id:"color-palette",children:"Color Palette"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"Fenix Finance uses a cohesive and vibrant color palette to create a consistent and visually appealing user experience. Below is the list of colors that are part of our design system."}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(___WEBPACK_IMPORTED_MODULE_3__.A,{colors:_colors_ts__WEBPACK_IMPORTED_MODULE_4__.l})]})}function MDXContent(props={}){const{wrapper:MDXLayout}={...(0,C_Users_Jose_Santana_Documents_Repositorios_esthetiqo_fenix_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim_mjs__WEBPACK_IMPORTED_MODULE_6__.R)(),...props.components};return MDXLayout?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(MDXLayout,{...props,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_createMdxContent,{...props})}):_createMdxContent(props)}},"./src/stories/Colors/colors.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{l:()=>COLORS});const COLORS=[{title:"Primary",colors:[{value:"#FF920C",label:"#FF920C",code:100},{value:"#F67702",label:"#F67702",code:200},{value:"rgba(249, 119, 2, 0.80)",code:300,label:"#F67702 - 80%"},{value:"#A0450C",label:"#A0450C",code:400},{value:"#813B0D",label:"#813B0D",code:500},{value:"#461B04",label:"#461B04",code:600}]},{title:"Secondary",colors:[{value:"#FCCE13",label:"#FCCE13",code:100},{value:"#ECB506",label:"#ECB506",code:200},{value:"#CC8C02",code:300,label:"#CC8C02"},{value:"#A26306",label:"#A26306",code:400},{value:"#864D0D",label:"#864D0D",code:500},{value:"#723F11",label:"#723F11",code:600}]},{title:"Tertiary",colors:[{value:"#73739B",label:"#73739B",code:100},{value:"#54547A",label:"#54547A",code:200},{value:"rgba(84, 84, 122, 0.60)",code:300,label:"#54547A - 60%"},{value:"rgba(84, 84, 122, 0.40)",label:"#54547A",code:400},{value:"rgba(36, 36, 43, 0.40)",label:"#54547A - 40%",code:500},{value:"rgba(36, 36, 43, 0.20)",label:"#723F11 - 20%",code:600}]},{title:"Neutral",colors:[{value:"#FFFFFF",label:"#FFFFFF",code:100},{value:"#818187",label:"#818187",code:200},{value:"#35353C",code:300,label:"#35353C"},{value:"#24242B",label:"#24242B",code:400},{value:"rgba(36, 36, 43, 0.60)",label:"#24242B - 60%",code:500},{value:"#1A1A1B",label:"#1A1A1B",code:600},{value:"rgba(26, 26, 27, 0.60)",label:"#1A1A1B - 60%",code:700},{value:"rgba(26, 26, 27, 0.40)",label:"#1A1A1B - 60%",code:800},{value:"#101013",label:"#101013",code:900}]},{title:"Success",colors:[{value:"#10D777",label:"#10D777",code:100},{value:"#06B360",label:"#06B360",code:200},{value:"#098C4E",label:"#098C4E",code:300},{value:"#0D6E41",label:"#0D6E41",code:400},{value:"#0D5A38",label:"#0D5A38",code:500},{value:"#00331D",label:"#00331D",code:600}]},{title:"Error",colors:[{value:"#FB3850",label:"#FB3850",code:100},{value:"#E91F38",label:"#E91F38",code:200},{value:"#C41127",label:"#C41127",code:300},{value:"#A21224",label:"#A21224",code:400},{value:"#861624",label:"#861624",code:500},{value:"#49060E",label:"#49060E",code:600}]},{title:"Networks",colors:[{value:"#0052FF",label:"#0052FF",code:"Base"},{value:"#FCFC03",label:"#FCFC03",code:"Blast"}]}]},"./src/stories/Colors/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>stories_Colors});var jsx_runtime=__webpack_require__("./node_modules/next/dist/compiled/react/jsx-runtime.js");__webpack_require__("./node_modules/next/dist/compiled/react/index.js");const Color=param=>{let{value,code,label}=param;return(0,jsx_runtime.jsxs)("div",{className:"flex flex-col",children:[(0,jsx_runtime.jsx)("div",{className:"w-20 h-20 rounded-md",style:{background:"".concat(value)}}),(0,jsx_runtime.jsx)("p",{className:"text-white text-sm !mt-2 !mb-0 font-semibold",children:code}),(0,jsx_runtime.jsx)("p",{className:"text-neutral-200 text-sm !my-0",children:label})]})},Colors_Color=Color;Color.__docgenInfo={description:"",methods:[],displayName:"Color",props:{value:{required:!0,tsType:{name:"string"},description:""},label:{required:!0,tsType:{name:"string"},description:""},code:{required:!0,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""}}};const Colors=param=>{let{colors}=param;return(0,jsx_runtime.jsx)("div",{className:"max-w-[80rem] mx-auto my-[10rem]",children:colors.map(((color,index)=>(0,jsx_runtime.jsxs)("div",{className:"!mb-10",children:[(0,jsx_runtime.jsx)("h6",{className:"text-white text-lg mb-5 font-semibold",children:color.title}),(0,jsx_runtime.jsx)("section",{className:"flex w-full items-center gap-10",children:color.colors.map(((color,index)=>(0,jsx_runtime.jsx)(Colors_Color,{value:color.value,code:color.code,label:color.label},index)))})]},index)))})},stories_Colors=Colors;Colors.__docgenInfo={description:"",methods:[],displayName:"Colors",props:{colors:{required:!0,tsType:{name:"Array",elements:[{name:"Colors"}],raw:"Colors[]"},description:""}}}}}]);