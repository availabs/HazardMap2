import React from "react"

import { useDms } from "components/dms/contexts/dms-context"
import { useAuth } from "components/dms/contexts/auth-context"
// import { useTheme } from "components/avl-components/wrappers/with-theme"

import { useSetSections } from "components/dms/wrappers/dms-create"

import { createEmpty } from "components/dms/components/editor"

import { useDmsSections } from "components/dms/components/utils/dms-input-utils"
import { Button } from "@availabs/avl-components"


import get from 'lodash.get'

let Edit = React.forwardRef(({ Attribute, id, autoFocus = false, onFocus, onBlur, onChange, value, save, buttonDisabled, ...props }, ref) => {
  value = value || {};

  const Props = { ...props, ...useDms(), user: useAuth().user };
  const sections = useSetSections(Attribute.Format),
    Sections = useDmsSections(sections, value, onChange, Props);

  let Title = get(Sections, '[0].attributes',[]).filter(a => a.key === 'title').pop()
  let Section = get(Sections, '[0].attributes',[]).filter(a => a.key === 'section').pop()
  let Content = get(Sections, '[0].attributes',[]).filter(a => a.key === 'content').pop()
 

  return (
    <div className='w-full'>
        <div className='relative px-4 sm:px-6 lg:px-12'>
            <h3 className='section-header text-xl tracking-wider mx-auto mb-2 mt-2 font-medium border-b border-t border-gray-300 py-2 flex'>
                {Title ? 
                <Title.Input
                    ref={ ref }
                    className='p-1'
                    autoFocus={true}
                    value={ value[Title.key] }
                    placeholder={'Section Title'}
                    onChange={Title.onChange}
                /> : ''}
                <Button 
                    className="ml-2 py-1 px-2"
                    onClick={ save } 
                    disabled={ buttonDisabled }
                >
                    Save
                </Button>
            </h3>
            <div className='h-10 border-b w-full'>

                {Section ? 
                <Section.Input
                    ref={ ref }
                    className='p-1'
                    autoFocus={true}
                    value={ value[Section.key] }
                    placeholder={'#Section'}
                    onChange={Section.onChange}
                /> : ''}
            </div>
            <div className='font-normal text-lg leading-8 text-gray-600'>
                {Content ? 
                <Content.Input
                    ref={ ref }
                    autoFocus={true}
                    value={ get(value, `[${Content.key}]`, createEmpty()) }
                    placeholder={'Section Content'}
                    onChange={Content.onChange}
                /> : ''}
            </div>
        </div>
    </div>
  )
})

Edit.settings = {
    hasControls: true
}

export default Edit