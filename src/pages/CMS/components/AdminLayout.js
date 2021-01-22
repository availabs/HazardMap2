import React  from "react"
import {SideNav, useTheme} from '@availabs/avl-components'
import logo from './Logo.js'

const AdminLayout = ({children}) => {
	const theme = useTheme()
	return (
	  	<div className="w-full">
	  		<div className="flex min-h-screen">
		  		<SideNav  
		  			logo={<div className='border-b border-gray-200'>{logo('SHMP')}</div>}
		  			topMenu={<div className='border-b border-gray-200 pb-3'></div>}
		    		menuItems={[
		    			{
			                name: 'Home',
			                id: 0,
			                path: `/admin/`, 
			                sectionClass: 'mt-4'
			            },
		    			{
			                name: 'Plan',
			                id: 0,
			                path: `/cms/`
			            }
		    		]}
		    		fixed={true}
		    	/>
		    	<div className={`flex-1 md:ml-${theme.sidebarW}`}>	
	    			{children}
	    		</div>
	    	</div>
		</div>
	)
}

export default AdminLayout