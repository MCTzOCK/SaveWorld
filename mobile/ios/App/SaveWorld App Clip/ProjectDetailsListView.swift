//
//  ProjectDetailsListView.swift
//  SaveWorld App Clip
//
//  Created by Ben on 13.01.24.
//
import SwiftUI

struct ProjectDetailsListView: View {
    @Binding var segments: [Segment]

    var body: some View {
        List(segments, id: \._id) { segment in
            VStack(alignment: .leading) {
                Text(segment.title)
                    .font(.title2)
                    .fontWeight(.black)
                Text(segment.content)
            }
        }
    }
}
