//
//  TodoModel.swift
//  todos
//
//  Created by Riley James Paul on 2026-04-13.
//

import Foundation

struct TodoModel: Identifiable, Codable, Hashable {
    var id: String
    var text: String
    var isCompleted: Bool
}
