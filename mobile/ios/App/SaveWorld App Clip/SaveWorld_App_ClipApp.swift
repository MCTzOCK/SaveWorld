//
//  SaveWorld_App_ClipApp.swift
//  SaveWorld App Clip
//
//  Created by Ben on 13.01.24.
//

import SwiftUI

@main
struct SaveWorld_App_ClipApp: App {
    var body: some Scene {
        WindowGroup {
            TabView {
                ContentView()
                    .tabItem {
                        Label("Liste", systemImage: "list.bullet")
                    }
            }
        }
    }
}
