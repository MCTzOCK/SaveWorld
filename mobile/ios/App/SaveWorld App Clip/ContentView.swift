//
//  ContentView.swift
//  SaveWorld App Clip
//
//  Created by Ben on 13.01.24.
//
import SwiftUI
import Combine

struct ContentView: View {
    @State private var projects: [Project] = []
    @State private var cancellables: Set<AnyCancellable> = []
    private let apiURL = URL(string: "https://api.saveworld.one/eco-projects/list")!

    var body: some View {
        NavigationView {
            ProjectListView(projects: $projects)
                .navigationTitle("SaveWorld Projekte")
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

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
