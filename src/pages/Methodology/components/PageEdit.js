
import React  from "react"
// import { useTheme } from "components/avl-components/wrappers/with-theme"
import { useTheme } from "@availabs/avl-components"
import DocsWrapper from './DocsWrapper'
import SideNav from './SideNav'

// import { List, ListItemAction, Input } from 'components/avl-components/components'
// import { Link } from 'react-router-dom'

import { DmsButton } from "components/dms/components/dms-button"



export const Create = ({ createState, setValues, item, dataItems, ...props }) => {
    const theme = useTheme();
    let Title = createState.sections[0].attributes[3]
    let Content = createState.sections[0].attributes[4]
    let Tags = createState.sections[0].attributes[5]

    let navItems = dataItems
        .filter(d => d.data.sectionLanding)
        .map((d,i) => {
            return {
                name: d.data.section,
                path: `/docs/edit/${d.id}`,
                sectionClass: 'mb-4',
                itemClass: 'font-bold',
                itemStyle: {fontWeight: 700, textTransform: 'uppercase'},
                children: dataItems
                    .filter(({ data }) => !data.sectionLanding && (data.section === d.data.section))
                    .map(p => ({name: p.data.title, path: `/docs/edit/${p.id}`, itemsStyle: {paddingLeft: 10, fontWeight: 100}}))
            }
        })

    return (
        <DocsWrapper>
            <div className='flex'>
                <div className='overflow-hidden sticky ' style={{width: '13rem'}}>
                    <SideNav menuItems={navItems}/>
                </div>
                <div className='flex-1'>
                    <form onSubmit={ e => e.preventDefault() }>
                        <div className="w-full flex flex-col justify-center hasValue h-min-screen" style={{
                            backgroundColor:'#fefefe',
                            padding: "35px",
                            boxShadow: '0 0 30px 6px rgba(31,51,73,.1)',
                            borderRadius: "4px",
                            width:'100%'
                        }}>
                            <div
                                className={`text-3xl text-3xl font-bold leading-7 flex-1 flex`}>
                                <Title.Input
                                    className={`w-full text-xl p-4 flex-1 rounded-lg  ${theme.text}`}
                                    autoFocus={ true }
                                    value={ Title.value }
                                    placeholder={'Section Title'}
                                    onChange={ Title.onChange }
                                />
                            </div>
                            *<div
                            className={`hidden`}>
                            <div>Tags</div>
                            <Tags.Input
                                className={`border-none active:border-none focus:outline-none custom-bg h-full ${theme.text}`}
                                value={ Tags.value }

                            />
                        </div>
                            <div
                                className={`p-2 font-thin overflow-hidden`}>
                                <Content.Input
                                    className={`p-4 border-none active:border-none focus:outline-none custom-bg h-full ${theme.text}`}
                                    value={ Content.value }
                                    onChange={ Content.onChange }
                                />
                            </div>

                        </div>
                        <div className="mt-2 mb-4 max-w-2xl">
                            <DmsButton className="w-1/2" large  type="submit"
                                       action={ createState.dmsAction } item={ item } props={ props }/>
                        </div>
                    </form>
                </div>
            </div>
        </DocsWrapper>
    )
}

export default Create
