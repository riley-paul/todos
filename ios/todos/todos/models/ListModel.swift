//
//  ListModel.swift
//  todos
//
//  Created by Riley James Paul on 2026-04-13.
//

import Foundation

struct ListModel: Identifiable, Codable {
    var id: UUID
    var name: String
    var todoCount: Int
}
