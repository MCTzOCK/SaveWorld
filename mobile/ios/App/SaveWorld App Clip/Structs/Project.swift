//
//  Project.swift
//  SaveWorld App Clip
//
//  Created by Ben on 13.01.24.
//

import Foundation

struct Project: Decodable {
    var _id: String;
    var owner: String;
    var name: String;
    var startDate: String;
    var lastsDays: Int;
    var geoLocationType: String;
    var geoLocationDisplayName: String;
    var geoLocationLat: String;
    var geoLocationLon: String;
    var users: [String];
    var __v: Int;
}
