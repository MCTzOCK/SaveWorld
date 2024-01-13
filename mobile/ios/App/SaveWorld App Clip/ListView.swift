//
//  ListView.swift
//  SaveWorld App Clip
//
//  Created by Ben on 13.01.24.
//

import SwiftUI
import Combine

struct ListView: View {
    @State private var projects: [Project] = []
    @State private var cancellables: Set<AnyCancellable> = [] // Declare cancellables as a @State variable
    private let apiURL = URL(string: "https://api.saveworld.one/eco-projects/list")!

    var body: some View {
        NavigationView {
            List(projects, id: \._id) { project in
                VStack(alignment: .leading) {
                    Text(project.name)
                        .font(.title2)
                        .fontWeight(.bold)
                    Text(project.startDate.split(separator: "T")[0])
                    Text(project.geoLocationDisplayName)
                }
            }
        }
        .onAppear {
            fetchData()
        }
    }

    private func fetchData() {
        URLSession.shared.dataTaskPublisher(for: apiURL)
            .map(\.data)
            .decode(type: ApiResponse.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { completion in
                switch completion {
                case .finished:
                    break
                case .failure(let error):
                    print("Error: \(error.localizedDescription)")
                }
            }, receiveValue: { response in
                self.projects = response.entries
            })
            .store(in: &cancellables)
    }
}
