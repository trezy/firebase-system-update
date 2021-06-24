// Module imports
import Link from 'next/link'





// Local imports
import { useAppContext } from 'contexts/AppContext'





export function ProjectConfigurationSidebar(props) {
	const { projectID } = props
	const {
		data: { projects },
	} = useAppContext()

	const project = projects[projectID]

	return (
		<aside className="column is-one-quarter is-scrollable menu">
			<p className="menu-label">
				General
			</p>
			<ul className="menu-list">
				<li>
					<Link href="/">
						<a>Dashboard</a>
					</Link>
				</li>

				<li>
					<Link href="/">
						<a>Customers</a>
					</Link>
				</li>
			</ul>

			<p className="menu-label">
				Firestore
			</p>
			<ul className="menu-list">
				<li>
					<Link href="/">
						<a>Dashboard</a>
					</Link>
				</li>

				<li>
					<Link href="/">
						<a>Customers</a>
					</Link>
				</li>
			</ul>

			<p className="menu-label">
				Realtime Database
			</p>
			<ul className="menu-list">
				<li>
					<Link href="/">
						<a>Dashboard</a>
					</Link>
				</li>

				<li>
					<Link href="/">
						<a>Customers</a>
					</Link>
				</li>
			</ul>

			<p className="menu-label">
				Storage
			</p>
			<ul className="menu-list">
				<li>
					<Link href="/">
						<a>Team Settings</a>
					</Link>
				</li>

				<li>
					<a className="is-active">Manage Your Team</a>

					<ul>
						<li>
							<Link href="/">
								<a>Members</a>
							</Link>
						</li>

						<li>
							<Link href="/">
								<a>Plugins</a>
							</Link>
						</li>

						<li>
							<Link href="/">
								<a>Add a member</a>
							</Link>
						</li>

					</ul>
				</li>

				<li>
					<Link href="/">
						<a>Invitations</a>
					</Link>
				</li>

				<li>
					<Link href="/">
						<a>Cloud Storage Environment Settings</a>
					</Link>
				</li>

				<li>
					<Link href="/">
						<a>Authentication</a>
					</Link>
				</li>
			</ul>
		</aside>
	)
}
