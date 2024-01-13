//
//  Model.swift
//  SaveWorld App Clip
//
//  Created by Ben on 13.01.24.
//
import Foundation

struct Project: Identifiable, Decodable {
    var id: String { _id }
    let _id: String
    let owner: String
    let name: String
    let startDate: String
    let lastsDays: Int
    let geoLocationType: String
    let geoLocationDisplayName: String
    let geoLocationLat: String
    let geoLocationLon: String
    let users: [String]
    let __v: Int
}

struct ApiResponse: Decodable {
    let status: Int
    let entries: [Project]
    let pages: Int
}

struct Segment: Identifiable, Decodable {
    var id: String { _id }
    let _id: String
    let project: String
    let pinned: Bool
    let title: String
    let content: String
    let type: String
    let __v: Int
}

struct ProjectDetailsResponse: Decodable {
    let status: Int
    let segments: [Segment]
}
