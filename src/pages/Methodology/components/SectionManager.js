
import React, { useState  }  from "react"

import { Link } from 'react-router-dom'

// import DndList from "components/avl-components/components/List/DndList"
// import { ListItemAction, Input } from 'components/avl-components/components'
import {
    DndList,
    ListItemAction, Input
} from "@availabs/avl-components"

import { DmsButton } from "components/dms/components/dms-button"

import { makeFilter } from "components/dms/utils"

import DocsWrapper from './DocsWrapper'

import get from "lodash.get"

// import ReadOnlyEditor from "components/DMS/components/editor/editor.read-only"

const reducer = (state, action) => {
    switch (action.type) {
        case "open":
            return {
                ...Object.keys(state).reduce((a, c) => ({ ...a, [c]: "closed" }), {}),
                [action.id]: "opened"
            };
        case "close":
            return { ...state, [action.id]: "closed" };
    }
}

export default ({ dataItems, interact, ...props }) => {
    const [newSectionTitle, setNewSectionTitle] = useState('');

    const droppedSection = React.useCallback((start, end) => {
        const sections = [...dataItems]
            .filter(({ data }) => data.sectionLanding)
            .sort((a, b) => a.data.index - b.data.index);

        const [item] = sections.splice(start, 1);
        sections.splice(end, 0, item);

        sections.forEach((item, i) => {
            interact("api:edit", item.id, { ...item.data, index: i }, { loading: false });
            item.data.index = i; // <-- this is temp. It just makes the list look nice until data is updated
        })
    })

    const droppedSubsection = React.useCallback((start, end, section) => {
        const subSection = [...dataItems]
            .filter(({ data }) => !data.sectionLanding && (data.section === section))
            .sort((a, b) => a.data.index - b.data.index);

        const [item] = subSection.splice(start, 1);
        subSection.splice(end, 0, item);

        subSection.forEach((item, i) => {
            interact("api:edit", item.id, { ...item.data, index: i }, { loading: false });
            item.data.index = i; // <-- this is temp. It just makes the list look nice until data is updated
        })
    }, [dataItems, interact]);

    const [state, dispatch] = React.useReducer(reducer, {});

    return (
        <DocsWrapper>
            <div className="flex mt-3">
                <Input value={ newSectionTitle } onChange={ setNewSectionTitle }
                       className='w-full text-xl p-4 flex-1 rounded-lg'
                       placeholder="Enter section name..." autoFocus/>
                <DmsButton large className="flex-0 text-xl ml-3"
                           action={ {
                               disabled: !Boolean(newSectionTitle),
                               action: 'api:create',
                               seedProps: () => ({ section: newSectionTitle, sectionLanding: true })
                           } }/>
            </div>
            { !dataItems.length ? null :
                <DndList onDrop={ droppedSection }>
                    { dataItems
                        .filter(d => d.data.sectionLanding)
                        .sort((a, b) => +a.data.index - +b.data.index)
                        .map((d, i) => {
                            const subSections = dataItems
                                .filter(({ data }) => !data.sectionLanding && (data.section === d.data.section))
                                .sort((a, b) => +a.data.index - +b.data.index);
                            const max = get(subSections, [subSections.length - 1, "data", "index"], -1);
                            return (
                                <div key={ i }>
                                    <div style={ { display: "flex", alignItems: "center" } }>
                                        <div style={ { flexGrow: 1, display: "flex", alignItems: "center" } }>
                                            <div style={ { fontWeight: "bold", fontSize: "1.5rem", width: "30px" } }
                                                 onClick={
                                                     e => dispatch({ type: state[d.id] === "opened" ? "close" : "open", id: d.id })
                                                 }>
                                                { !subSections.length ? null : state[d.id] === "opened" ? "-" : "+" }
                                            </div>
                                            ({ d.id }) { d.data.section }
                                        </div>
                                        <div style={ { flexGrow: 0 } }>
                                            <DmsButton key="create"
                                                       action={{
                                                           action: 'create',
                                                           seedProps: () => ({ section: d.data.section, index: max + 1 })
                                                       }}
                                                       label='Add Page'/>
                                            <DmsButton key="edit" item={ d.id }
                                                       action="edit" className="ml-3 flex-0"/>
                                            <DmsButton key="api:delete" item={ d.id }
                                                       className="ml-3"
                                                       action={ {
                                                           action: 'api:delete',
                                                           showConfirm: true
                                                       } }
                                                       label='Delete'/>
                                        </div>
                                    </div>
                                    { state[d.id] !== "opened" ? null :
                                        <div style={ { flexGrow: 1 } }>
                                            <DndList onDrop={ (start, end) => droppedSubsection(start, end, d.data.section) }>
                                                { subSections.map(d =>
                                                    <div key={ d.id } className="flex border-2 rounded-lg" style={ { padding: "1rem", alignItems: "center" } }>
                                                        <div className="flex-1">
                                                            <Link to={ `/docs/view/${ d.id }` }>
                                                                <h4 style={ { margin: "0px" } }>{ d.data.title }</h4>
                                                            </Link>
                                                        </div>
                                                        <DmsButton item={ d.id } action="edit" className="ml-3 flex-0"/>
                                                        <DmsButton item={ d.id } action="api:delete" className="ml-3 flex-0"/>
                                                    </div>
                                                )
                                                }
                                            </DndList>
                                        </div>
                                    }
                                </div>
                            )
                        })
                    }
                </DndList>
            }
        </DocsWrapper>
    )
}
