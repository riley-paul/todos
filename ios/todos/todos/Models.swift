import Foundation

struct TodoSelect: Identifiable, Codable {
    let id: UUID
    var text: String
    var isCompleted: Bool
}
