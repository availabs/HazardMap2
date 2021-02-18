import React  from "react"

const DocsWrapper = ({children}) => (
    <div className='container'
         style={ {
             marginBottom: "50px",
             position: "relative"
         } }>
        <div className='pt-4 pb-3'>
            <h1 className='fill-blue dot pad1 contain fa fa-arrow-right icon-white inline'></h1>
            <h3 className='inline font-bold text-3xl' style={{paddingLeft: '6px', marginTop: "10px", verticalAlign: 'middle' }}> Documentation </h3>
        </div>
        {children}
    </div>
)

export default DocsWrapper
