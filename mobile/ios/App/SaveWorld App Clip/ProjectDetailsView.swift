//
//  ProjectDetailsView.swift
//  SaveWorld App Clip
//
//  Created by Ben on 13.01.24.
//
import SwiftUI
import Combine

struct ProjectDetailsView: View {
    @State private var segments: [Segment] = []
    @State private var cancellables: Set<AnyCancellable> = []
    let projectId: String
    private var projectURL: URL {
        URL(string: "https://api.saveworld.one/eco-projects/project/homepage/segments?id=\(projectId)")!
    }

    var body: some View {
        VStack {
            ProjectDetailsListView(segments: $segments)
        }
        .onAppear {
            fetchProjectDetails()
        }
    }

    private func fetchProjectDetails() {
        URLSession.shared.dataTaskPublisher(for: projectURL)
            .map(\.data)
            .decode(type: ProjectDetailsResponse.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { completion in
                switch completion {
                case .finished:
                    break
                case .failure(let error):
                    print("Error: \(error.localizedDescription)")
                }
            }, receiveValue: { response in
                self.segments = response.segments
            })
            .store(in: &cancellables)
    }
}

struct ProjectDetailsView_Previews: PreviewProvider {
    static var previews: some View {
        ProjectDetailsView(projectId: "example_project_id")
    }
}
