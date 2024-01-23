//
//  SaveWorld_Widgets.swift
//  SaveWorld Widgets
//
//  Created by Ben on 13.01.24.
//

import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        entries.append(SimpleEntry(date: Date()))

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    var date: Date
}

struct SaveWorld_WidgetsEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        
        VStack {
            Text("SaveWorld")
                .foregroundStyle(.green)
                .fontWeight(.black)
                .font(.largeTitle)
            HStack {
                Link(destination: URL(string: "saveworld://onboarding")!) {
                    Image(systemName: "house.fill")
                        .padding()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(.blue)
                        .font(.title2)
                        .cornerRadius(12)
                }
                Link(destination: URL(string: "saveworld://ai")!) {
                    Image(systemName: "bolt.fill")
                        .padding()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(.red)
                        .font(.title2)
                        .cornerRadius(12)
                }
                Link(destination: URL(string: "saveworld://e2")!) {
                    Image(systemName: "leaf.fill")
                        .padding()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(.green)
                        .font(.title2)
                        .cornerRadius(12)
                        .aspectRatio(contentMode: .fill)
                }
                Link(destination: URL(string: "saveworld://learn")!) {
                    Image(systemName: "video.fill")
                        .padding()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(.orange)
                        .font(.title2)
                        .cornerRadius(12)
                }
            }
        }
    }
}

struct SaveWorld_Widgets: Widget {
    let kind: String = "SaveWorld_Widgets"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            if #available(iOS 17.0, *) {
                SaveWorld_WidgetsEntryView(entry: entry)
                    .containerBackground(.black, for: .widget)
                    .foregroundColor(.white)
            } else {
                SaveWorld_WidgetsEntryView(entry: entry)
                    .background(.black)
                    .foregroundColor(.white)
                    .padding()
            }
        }
        .configurationDisplayName("SaveWorld Widget")
        .description("SaveWorld Widget")
        .supportedFamilies([.systemMedium])
    }
}

#Preview(as: .systemSmall) {
    SaveWorld_Widgets()
} timeline: {
    SimpleEntry(date: Date())
}
