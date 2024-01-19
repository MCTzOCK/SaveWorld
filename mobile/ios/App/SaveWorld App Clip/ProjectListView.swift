//
//  ProjectListView.swift
//  SaveWorld App Clip
//
//  Created by Ben on 13.01.24.
//

import SwiftUI

struct ProjectListView: View {
    @Binding var projects: [Project]

    var body: some View {
        List(projects, id: \._id) { project in
            NavigationLink(destination: ProjectDetailsView(projectId: project._id)) {
                VStack(alignment: .leading) {
                    Text(project.name)
                        .font(.title2)
                        .fontWeight(.black)
                    Text(project.startDate.split(separator: "T")[0])
                    Text(project.geoLocationDisplayName)
                }
            }
        }
    }
}
