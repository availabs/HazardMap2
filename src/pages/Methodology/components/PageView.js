import React  from "react"
// import { useTheme } from "components/avl-components/wrappers/with-theme"
import DocsWrapper from './DocsWrapper'

import SideNav from './SideNav'

import ReadOnlyEditor from "components/dms/components/editor/editor.read-only"

import get from "lodash.get";

const View = ({ item, dataItems, ...props }) => {
    // const theme = useTheme();

    const data = get(item, "data");
    if (!data) return <div>Loading Data...</div>

    console.log('item', item)
    console.log('dataItems', dataItems)
    console.log(' the data ', data)

    let navItems = dataItems
        .filter(d => d.data.sectionLanding)
        .sort((a, b) => +a.data.index - +b.data.index)
        .map((d,i) => {
            return {
                name: d.data.section,
                // path: `/docs/view/${d.id}`,
                item: d,
                sectionClass: 'mb-4',
                itemClass: 'font-bold',
                itemStyle: {fontWeight: 700, textTransform: 'uppercase'},
                children: dataItems
                    .filter(({ data }) => !data.sectionLanding && (data.section === d.data.section))
                    .sort((a, b) => +a.data.index - +b.data.index)
                    .map(p => ({name: p.data.title, path: `/docs/view/${p.id}`, item: p, itemsStyle: {paddingLeft: 10, fontWeight: 100}}))
            }
        })

    return (
        <DocsWrapper >
            <div className='w-full mt-3 flex' >
                <div className='sticky top-0' style={{width: '13rem'}}>
                    <SideNav menuItems={navItems} />
                </div>
                <div className='flex flex-1'>
                    <div className={'font-thin'} style={{
                        backgroundColor:'#fefefe',
                        padding: "35px",
                        boxShadow: '0 0 30px 6px rgba(31,51,73,.1)',
                        borderRadius: "4px",
                        width:'100%'
                    }}>
                        <ReadOnlyEditor key={ item.id } value={ data.content }/>
                    </div>
                </div>
            </div>
        </DocsWrapper>
    )
}

export default View
